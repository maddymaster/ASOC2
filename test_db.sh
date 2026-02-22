#!/bin/bash
npx dotenv -e .env.local -- prisma db push
