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
  assignment_id: string,
  min_score: number | undefined,
  last_n_hours: number | undefined
): Promise<any> {
  let subs: any[] = [];
  const firstResponse = await httpClient.sendRequest<T>({
    method: HttpMethod.GET,
    url: `https://${authentication.org_id}.instructure.com/api/v1/courses/${courseId}/assignments/${assignment_id}/submissions?include=user&per_page=100`,
    authentication: {
      type: AuthenticationType.BEARER_TOKEN,
      token: authentication['access_token'],
    },
  });

  subs.push(firstResponse.body);

  const headers = firstResponse.headers;

  const linkHeader: string | undefined = headers?.['link'] as string;
  const links = linkHeader.split(',');

  const lastPageLink = links.find((link) => link.includes('rel="last"'));

  const pageNumMatch = lastPageLink?.match(/page=(\d+)/);
  const finalPageNum = pageNumMatch ? parseInt(pageNumMatch[1]) : 1;

  if (finalPageNum > 1) {
    for (let i = 2; i <= finalPageNum; i++) {
      const response = await httpClient.sendRequest<T>({
        method: HttpMethod.GET,
        url: `https://${authentication.org_id}.instructure.com/api/v1/courses/${courseId}/assignments/${assignment_id}/submissions?include=user&per_page=100&page=${i}`,
        authentication: {
          type: AuthenticationType.BEARER_TOKEN,
          token: authentication['access_token'],
        },
      });
      subs.push(response.body);
    }
  }

  if (min_score) {
    subs = subs.filter((sub: any) => {
      return sub.score >= min_score;
    });
  }

  if (last_n_hours) {
    subs = subs.filter((sub: any) => {
      return (
        new Date(sub.submitted_at) > new Date(Date.now() - 3600 * last_n_hours)
      );
    });
  }

  return subs.flat(2);
}

export async function canvasApiQuizSubmissions<T extends HttpMessageBody>(
  authentication: {
    org_id: string;
    access_token: string;
  },
  courseId: string,
  quiz_id: string
): Promise<any[]> {
  const subs: any[] = [];
  const firstResponse = await httpClient.sendRequest<T>({
    method: HttpMethod.GET,
    url: `https://${authentication.org_id}.instructure.com/api/v1/courses/${courseId}/quizzes/${quiz_id}/submissions?include=user&per_page=100`,
    authentication: {
      type: AuthenticationType.BEARER_TOKEN,
      token: authentication['access_token'],
    },
  });
  const headers = firstResponse.headers;
  const linkHeader: string | undefined = headers?.['Link'] as string;
  const links = linkHeader.split(',');

  const lastPageLink = links.find((link) => link.includes('rel="last"'));

  const pageNumMatch = lastPageLink?.match(/page=(\d+)/);
  const finalPageNum = pageNumMatch ? parseInt(pageNumMatch[1]) : 1;

  for (let i = 2; i <= finalPageNum; i++) {
    const response = await httpClient.sendRequest<T>({
      method: HttpMethod.GET,
      url: `https://${authentication.org_id}.instructure.com/api/v1/courses/${courseId}/quizzes/${quiz_id}/submissions?include=user&per_page=100&page=${i}`,
      authentication: {
        type: AuthenticationType.BEARER_TOKEN,
        token: authentication['access_token'],
      },
    });
    subs.push(response.body);
  }

  return subs;
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
