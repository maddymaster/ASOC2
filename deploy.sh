#!/bin/bash
set -e

SERVICE_NAME="mission-control"
REGION="us-central1"
PROJECT_ID="asoc-487213"

echo "=================================================="
echo "Mission Control Deployment (Source Deploy)"
echo "Project: $PROJECT_ID"
echo "Region: $REGION"
echo "=================================================="

# 1. Convert .env.local to env.yaml for gcloud
echo "Preparing environment variables..."
if [ -f .env.local ]; then
    # Create a temporary yaml file
    # 1. Remove comments (#)
    # 2. Remove empty lines
    # 3. Convert KEY=VALUE to KEY: "VALUE"
    # Note: This is a basic converter. Complex values with quotes might need care.
    
    echo "# Auto-generated from .env.local" > env.yaml
    while IFS= read -r line || [[ -n "$line" ]]; do
        # Skip comments and empty lines
        if [[ $line =~ ^#.* ]] || [[ -z $line ]]; then
            continue
        fi
        
        # Split by first '='
        key=$(echo "$line" | cut -d '=' -f 1)
        value=$(echo "$line" | cut -d '=' -f 2-)
        
        # Remove existing quotes if present to avoid double quoting "value" -> ""value""
        value="${value%\"}"
        value="${value#\"}"
        
        echo "$key: \"$value\"" >> env.yaml
    done < .env.local
else
    echo "Error: .env.local not found!"
    exit 1
fi

echo "[1/2] Deploying to Cloud Run..."
echo "Using source-based deployment with env.yaml..."

# Extract all NEXT_PUBLIC_ variables for the Next.js build phase
BUILD_ENV_VARS=$(grep '^NEXT_PUBLIC_' .env.local | tr '\n' ',' | sed 's/,$//')

# Note: This command builds the container using the Dockerfile in the current directory
# and deploys it to Cloud Run.
gcloud run deploy $SERVICE_NAME \
    --quiet \
    --source . \
    --region $REGION \
    --project $PROJECT_ID \
    --platform managed \
    --allow-unauthenticated \
    --service-account "mission-control-deployer@$PROJECT_ID.iam.gserviceaccount.com" \
    --env-vars-file env.yaml \
    --set-build-env-vars="$BUILD_ENV_VARS"

# Clean up
rm env.yaml

echo "=================================================="
echo "Deployment Initiated!"
echo "Watch the logs above for the Service URL."
echo "=================================================="
