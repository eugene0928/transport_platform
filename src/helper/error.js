import { ApolloError } from "apollo-server-express";

export class NotFound extends ApolloError {
    constructor(message) {
      super(message, 'NOT_FOUND');
  
      Object.defineProperty(this, 'NOT_FOUND', { value: 'NotFound' });
    }
}