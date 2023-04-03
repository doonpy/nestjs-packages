#!/bin/bash -e

VERSION=$1

if [[ -n "$VERSION" ]]; then
  npx nx run-many --all --target=publish --version=$VERSION --tag=$VERSION
  if [ $? -ne 0 ]; then
    exit 1
  fi
else
  echo "Nothing to release"
fi

exit 0
