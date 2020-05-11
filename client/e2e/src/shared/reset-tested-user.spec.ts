import { browser } from 'protractor';
import { HttpClient } from 'protractor-http-client';

import { testedUser } from '.';

export async function resetTestedUser() {
  const http = new HttpClient(browser.params.backendURL);

  const testingUsersApi = `/testing/user-data/${testedUser.email}`;
  const deleteResponse = http.delete(testingUsersApi, {
    Authorization: browser.params.testingCredentials
  });
  expect(await deleteResponse.statusCode).toEqual(200);
}
