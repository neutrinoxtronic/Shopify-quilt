import type {DocumentNode, OperationDefinitionNode} from 'graphql';

import type {FindOptions} from './types';

export function operationNameFromFindOptions({query, mutation}: FindOptions) {
  const passedOptions = [query, mutation].filter(Boolean);

  if (passedOptions.length === 0) {
    return undefined;
  } else if (passedOptions.length > 1) {
    throw new Error('You can only pass one of query or mutation');
  }

  return operationNameFromDocument((query || mutation)!);
}

export function operationNameFromDocument(
  document: DocumentNode | {resolver: {resolved?: DocumentNode}},
) {
  return 'resolver' in document && document.resolver.resolved != null
    ? operationNameFromDocumentNode(document.resolver.resolved)
    : operationNameFromDocumentNode(document as DocumentNode);
}

export function operationTypeFromDocument(
  document: DocumentNode | {resolver: {resolved?: DocumentNode}},
) {
  return 'resolver' in document && document.resolver.resolved != null
    ? operationTypeFromDocumentNode(document.resolver.resolved)
    : operationTypeFromDocumentNode(document as DocumentNode);
}

function operationNameFromDocumentNode(document: DocumentNode) {
  const [operation]: OperationDefinitionNode[] = document.definitions.filter(
    ({kind}) => kind === 'OperationDefinition',
  ) as any[];

  return operation && operation.name && operation.name.value;
}

function operationTypeFromDocumentNode(document: DocumentNode) {
  const [operation]: OperationDefinitionNode[] = document.definitions.filter(
    ({kind}) => kind === 'OperationDefinition',
  ) as any[];

  return operation && operation.operation;
}
