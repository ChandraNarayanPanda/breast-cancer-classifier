import json
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from app.main import app

SAMPLE = json.loads((Path(__file__).parent / "sample_request.json").read_text(encoding="utf-8"))


@pytest.fixture(scope="module")
def client():
    # "with" runs the startup code, so the model gets loaded
    with TestClient(app) as c:
        yield c


def test_health(client):
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"
    assert r.json()["model_loaded"] is True


def test_model_info_has_30_features(client):
    r = client.get("/model-info")
    assert r.status_code == 200
    assert r.json()["n_features"] == 30


def test_valid_prediction(client):
    r = client.post("/predict", json=SAMPLE)
    assert r.status_code == 200
    body = r.json()
    assert body["prediction"] in ("Benign", "Malignant")
    assert set(body["probabilities"]) == {"benign", "malignant"}
    assert "not a medical diagnosis" in body["disclaimer"]


def test_missing_field_rejected(client):
    bad = {k: v for k, v in SAMPLE.items() if k != "mean_radius"}
    assert client.post("/predict", json=bad).status_code == 422


def test_text_instead_of_number_rejected(client):
    assert client.post("/predict", json={**SAMPLE, "mean_radius": "abc"}).status_code == 422


def test_negative_value_rejected(client):
    assert client.post("/predict", json={**SAMPLE, "mean_radius": -5}).status_code == 422


def test_zero_rejected_where_not_allowed(client):
    assert client.post("/predict", json={**SAMPLE, "mean_radius": 0}).status_code == 422


def test_extra_field_rejected(client):
    assert client.post("/predict", json={**SAMPLE, "foo": 1}).status_code == 422


def test_zero_allowed_for_concavity(client):
    r = client.post("/predict", json={**SAMPLE, "mean_concavity": 0})
    assert r.status_code == 200


def test_nan_rejected(client):
    raw = json.dumps({**SAMPLE, "mean_radius": "__NAN__"}).replace('"__NAN__"', "NaN")
    r = client.post("/predict", content=raw, headers={"Content-Type": "application/json"})
    assert r.status_code == 422