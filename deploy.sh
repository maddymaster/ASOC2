#!/bin/bash
set -e

PROJECT_ID="asoc-487213"
REGION="us-central1"
REPO_NAME="mission-control"
SERVICE_NAME="mission-control"

echo "=================================================="
echo "Mission Control Deployment"
echo "Project: $PROJECT_ID"
echo "Region: $REGION"
echo "=================================================="

# 0. Create Artifact Registry Repo (Idempotent)
echo "[1/3] Checking Artifact Registry Repository..."
if ! gcloud artifacts repositories describe $REPO_NAME --location=$REGION --project=$PROJECT_ID > /dev/null 2>&1; then
    echo "Creating repository '$REPO_NAME'..."
    gcloud artifacts repositories create $REPO_NAME \
        --repository-format=docker \
        --location=$REGION \
        --project=$PROJECT_ID \
        --description="Mission Control Repository"
else
    echo "Repository '$REPO_NAME' already exists."
fi

# 1. Build and Push
echo "[2/3] Submitting Build..."
COMMIT_SHA=$(git rev-parse HEAD 2>/dev/null || echo "manual-$(date +%s)")
gcloud builds submit --config cloudbuild.yaml \
    --project=$PROJECT_ID \
    --substitutions=COMMIT_SHA=$COMMIT_SHA \
    .

IMAGE_URI="us-central1-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/app:$COMMIT_SHA"

# 2. Deploy to Cloud Run
echo "[3/3] Deploying to Cloud Run..."
# Note: We use .env.local for environment variables. 
# WARNING: Ensure DATABASE_URL in .env.local points to a reachable DB (Cloud SQL or public), not localhost.

gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_URI \
    --region $REGION \
    --project $PROJECT_ID \
    --platform managed \
    --allow-unauthenticated \
    --service-account "mission-control-deployer@$PROJECT_ID.iam.gserviceaccount.com" \
    --env-vars-file .env.local

echo "=================================================="
echo "Deployment Complete!"
echo "Service URL should be in the output above."
echo "=================================================="
