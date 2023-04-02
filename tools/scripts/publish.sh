#!/bin/bash -e

VERSION=$1
TAG=$2

if [[ -n "$VERSION" ]]; then
  npx nx run-many --all --target=publish --version=$VERSION --tag=$TAG
else
  echo "Nothing to release"
fi

exit 0
