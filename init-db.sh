#!/bin/bash
echo "Waiting for database to start..."
sleep 10
npm run init-etf-cache
npm run init-user-tables
npm run import-etf_data