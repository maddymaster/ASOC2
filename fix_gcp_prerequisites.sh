#!/bin/bash
set -e

PROJECT_ID="asoc-487213"

echo "=================================================="
echo "Fixing GCP Prerequisites for $PROJECT_ID"
echo "=================================================="

# 1. Billing Setup
echo ""
echo "[1/3] Billing Setup"
echo "Listing available billing accounts..."
gcloud billing accounts list

echo ""
read -p "Enter the BILLING_ACCOUNT_ID from the list above: " BILLING_ID

if [ -z "$BILLING_ID" ]; then
    echo "Check failed: Billing ID is required."
    exit 1
fi

echo "Linking billing account $BILLING_ID to project $PROJECT_ID..."
gcloud billing projects link $PROJECT_ID --billing-account=$BILLING_ID


# 2. Environment Tagging
echo ""
echo "[2/3] Environment Tagging"
echo "This project requires an 'environment' tag (e.g., Development)."
echo "Listing Tag Keys for your organization/folder..."

# Attempt to find the organization or folder ID from the project
# This can be tricky, so we'll try to look for keys at the project's parent level if possible, 
# or just ask the user to find the Tag Value ID if they know it.

# Creating a safer discovery approach
echo "Listing tag keys available to project..."
# We try to list keys. Note: This requires permissions.
gcloud resource-manager tags keys list --parent=organizations/$(gcloud projects describe $PROJECT_ID --format="value(parent.id)") 2>/dev/null || echo "Could not auto-list keys. Please ensure you have specific tag value ID ready."

echo "--------------------------------------------------"
echo "Instructions:"
echo "1. Findings the 'environment' key (e.g., tagKeys/12345)"
echo "2. Find the 'Development' value (e.g., tagValues/67890)"
echo "--------------------------------------------------"
echo "If you already know the TAG_VALUE_ID for 'Development', enter it below."
echo "If not, you may need to run 'gcloud resource-manager tags values list --parent=tagKeys/YOUR_KEY_ID' in a separate window."
echo ""

read -p "Enter TAG_VALUE_ID for 'Development' environment (leave empty to skip tagging if not sure): " TAG_VALUE_ID

if [ ! -z "$TAG_VALUE_ID" ]; then
    echo "Binding tag $TAG_VALUE_ID to project..."
    gcloud resource-manager tags bindings create \
        --resource=//cloudresourcemanager.googleapis.com/projects/$PROJECT_ID \
        --tag-value=$TAG_VALUE_ID
else
    echo "Skipping validation tag. Note: API enablement might fail if this policy is strict."
fi


# 3. Retry Enablement
echo ""
echo "[3/3] Retrying API Enablement..."
gcloud services enable \
    run.googleapis.com \
    artifactregistry.googleapis.com \
    secretmanager.googleapis.com \
    cloudbuild.googleapis.com

echo ""
echo "=================================================="
echo "Prerequisites Fixed (Hopefully)!"
echo "Now you can run ./setup_gcp.sh or ./deploy.sh"
echo "=================================================="
