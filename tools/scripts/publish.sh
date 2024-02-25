#!/bin/bash -e

VERSION=$1
BRANCH=$2

if [[ -n "$VERSION" ]]; then
  if [[ "$BRANCH" == "main" ]]; then
    TAG='latest'
  else
    TAG='next'
  fi

  pnpm exec nx run-many --target=publish --parallel=3 --ver=$VERSION --tag=$TAG
  if [ $? -ne 0 ]; then
    exit 1
  fi
else
  echo "Nothing to release"
fi

exit 0
