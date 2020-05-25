import { browser } from 'protractor';
import { HttpClient } from 'protractor-http-client';
import { testedUser } from '.';

const http = new HttpClient(browser.params.backendURL);

export async function registerUser() {
  await http.delete(`/testing/user/${testedUser.email}`, {
    Authorization: browser.params.testingCredentials
  });
  await http.post('/users/signin', testedUser);
}

export async function deleteTestedUser() {
  // tslint:disable-next-line: max-line-length
  const testingUsersApi = `/testing/user/${testedUser.email}`;
  const deleteResponse = http.delete(testingUsersApi, {
    Authorization: browser.params.testingCredentials
  });
  const response = await deleteResponse;
  expect([200, 404].indexOf(response.statusCode) > -1).toBeTruthy();
}
