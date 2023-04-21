#!/usr/bin/env bash

# Export env vars
export $(grep -v '^#' ./apps/be/.env | xargs)
export $(grep -v '^#' ./apps/web/.env | xargs)