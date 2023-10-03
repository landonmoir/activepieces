import {
  AuthenticationType,
  HttpMessageBody,
  HttpMethod,
  HttpResponse,
  httpClient,
} from '@activepieces/pieces-common';

export async function canvasApiCourses<T extends HttpMessageBody>(
  authentication: {
    org_id: string;
    access_token: string;
  },
  props: {
    enrollment_type: string | undefined;
    enrollment_state: string | undefined;
    exclude_blueprint_courses: boolean | undefined;
  }
): Promise<HttpResponse<T>> {
  return await httpClient.sendRequest<T>({
    method: HttpMethod.GET,
    url: `https://${
      authentication.org_id
    }.instructure.com/api/v1/courses?${buildParams(props)}`,
    authentication: {
      type: AuthenticationType.BEARER_TOKEN,
      token: authentication['access_token'],
    },
  });
}

export async function canvasApiQuizzes<T extends HttpMessageBody>(
  authentication: {
    org_id: string;
    access_token: string;
  },
  props: {
    search_term: string | undefined;
  },
  courseId: string
): Promise<HttpResponse<T>> {
  return await httpClient.sendRequest<T>({
    method: HttpMethod.GET,
    url: `https://${
      authentication.org_id
    }.instructure.com/api/v1/courses/${courseId}/quizzes?${buildParams(props)}`,
    authentication: {
      type: AuthenticationType.BEARER_TOKEN,
      token: authentication['access_token'],
    },
  });
}

export async function canvasApiAssignments<T extends HttpMessageBody>(
  authentication: {
    org_id: string;
    access_token: string;
  },
  courseId: string
): Promise<HttpResponse<T>> {
  return await httpClient.sendRequest<T>({
    method: HttpMethod.GET,
    url: `https://${authentication.org_id}.instructure.com/api/v1/courses/${courseId}/assignments`,
    authentication: {
      type: AuthenticationType.BEARER_TOKEN,
      token: authentication['access_token'],
    },
  });
}

export async function canvasApiCourseUsers<T extends HttpMessageBody>(
  authentication: {
    org_id: string;
    access_token: string;
  },
  courseId: string
): Promise<HttpResponse<T>> {
  return await httpClient.sendRequest<T>({
    method: HttpMethod.GET,
    url: `https://${authentication.org_id}.instructure.com/api/v1/courses/${courseId}/users`,
    authentication: {
      type: AuthenticationType.BEARER_TOKEN,
      token: authentication['access_token'],
    },
  });
}

export async function canvasApiAssignmentSubmissions<T extends HttpMessageBody>(
  authentication: {
    org_id: string;
    access_token: string;
  },
  courseId: string,
  assignment_id: string
): Promise<HttpResponse<T>> {
  return await httpClient.sendRequest<T>({
    method: HttpMethod.GET,
    url: `https://${authentication.org_id}.instructure.com/api/v1/courses/${courseId}/assignments/${assignment_id}/submissions`,
    authentication: {
      type: AuthenticationType.BEARER_TOKEN,
      token: authentication['access_token'],
    },
  });
}

export async function canvasApiQuizSubmissions<T extends HttpMessageBody>(
  authentication: {
    org_id: string;
    access_token: string;
  },
  courseId: string,
  quiz_id: string
): Promise<HttpResponse<T>> {
  return await httpClient.sendRequest<T>({
    method: HttpMethod.GET,
    url: `https://${authentication.org_id}.instructure.com/api/v1/courses/${courseId}/quizzes/${quiz_id}/submissions`,
    authentication: {
      type: AuthenticationType.BEARER_TOKEN,
      token: authentication['access_token'],
    },
  });
}

function buildParams(props: any) {
  const params = [];
  for (const key in props) {
    const value = props[key];
    if (value != null && value !== undefined) {
      params.push(`${key}=${encodeURIComponent(value)}`);
    }
  }
  return params.join('&');
}
