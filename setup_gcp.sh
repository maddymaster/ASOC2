#!/bin/bash
set -e

PROJECT_ID="asoc-487213"
REGION="us-central1"

echo "Setting project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

echo "Enabling APIs..."
gcloud services enable run.googleapis.com \
    artifactregistry.googleapis.com \
    secretmanager.googleapis.com \
    cloudbuild.googleapis.com

echo "Creating Service Account..."
# Check if SA exists first to avoid error
if ! gcloud iam service-accounts describe mission-control-deployer@${PROJECT_ID}.iam.gserviceaccount.com > /dev/null 2>&1; then
    gcloud iam service-accounts create mission-control-deployer \
        --display-name="Mission Control Deployer"
else
    echo "Service Account already exists."
fi

echo "Assigning Roles..."
SA_EMAIL="mission-control-deployer@${PROJECT_ID}.iam.gserviceaccount.com"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/storage.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/artifactregistry.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/iam.serviceAccountUser"

echo "--------------------------------------------------"
echo "GCP Setup Complete for project: $PROJECT_ID"
echo "--------------------------------------------------"
