import {
  PieceAuth,
  Property,
  createPiece,
} from '@activepieces/pieces-framework';

import { getAssignmentSubmissions } from './lib/actions/getAssignmentSubmissions';
import { getAssignments } from './lib/actions/getAssignments';
import { getCourses } from './lib/actions/getCourses';
import { getQuizSubmissions } from './lib/actions/getQuizSubmissions';
import { getQuizzes } from './lib/actions/getQuizzes';
import { getUsersInCourse } from './lib/actions/getUsersInCourse';

export const canvasAuth = PieceAuth.CustomAuth({
  description: 'Enter Canvas auth details',
  props: {
    org_id: Property.ShortText({
      displayName: 'Org Identifier',
      description: 'enter your canvas subdomain',
      required: true,
    }),
    access_token: Property.ShortText({
      displayName: 'Access Token',
      description: 'Enter the access token',
      required: true,
    }),
  },
  required: true,
  // Optional Validation
  validate: async ({ auth }) => {
    if (auth) {
      return {
        valid: true,
      };
    }
    return {
      valid: false,
      error: 'Invalid Api Key',
    };
  },
});

export const instructureCanvas = createPiece({
  displayName: 'Canvas',
  auth: canvasAuth,
  minimumSupportedRelease: '0.9.0',
  logoUrl:
    'https://i1.wp.com/www.calvary.edu/wp-content/uploads/2018/05/Canvas-Logo.png',
  authors: ['landonmoir'],
  actions: [
    getAssignmentSubmissions,
    getAssignments,
    getCourses,
    getQuizSubmissions,
    getQuizzes,
    getUsersInCourse,
  ],
  triggers: [],
});
