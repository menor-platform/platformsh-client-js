/* global beforeEach, afterEach*/

import { assert } from "chai";
import fetchMock from "fetch-mock";

import { getConfig } from "../src/config";
import { setAuthenticationPromise } from "../src/api";
import OrganizationSubscription from "../src/model/OrganizationSubscription";

describe("OrganizationSubscription", () => {
  const { api_url } = getConfig();

  beforeEach(function() {
    setAuthenticationPromise(Promise.resolve("testToken"));
  });

  afterEach(function() {
    fetchMock.restore();
  });

  it("Get organization subscription", done => {
    fetchMock.mock(`${api_url}/organizations/aliceOrg/subscriptions/1`, {
      project_region: "region"
    });
    OrganizationSubscription.get({ organizationId: "aliceOrg", id: "1" }).then(
      subscription => {
        assert.equal(subscription.project_region, "region");
        assert.equal(subscription.constructor.name, "OrganizationSubscription");
        done();
      }
    );
  });

  it("Get organization subscription estimate", done => {
    fetchMock.mock(`${api_url}/organizations/aliceOrg/subscriptions/1`, {
      id: 1,
      project_region: "region",
      plan: "test_plan",
      storage: "test_storage",
      environments: [],
      user_licences: ["test_user_licences"]
    });

    fetchMock.mock(
      `${api_url}/organizations/aliceOrg/subscriptions/1/estimate?plan=test_plan&storage=test_storage&`,
      {
        project_region: "region"
      }
    );
    OrganizationSubscription.get({ organizationId: "aliceOrg", id: "1" }).then(
      subscription => {
        console.log(subscription._queryUrl);
        assert.equal(subscription.project_region, "region");
        assert.equal(subscription.constructor.name, "OrganizationSubscription");
        subscription.getEstimate().then(es => {
          done();
        });
      }
    );
  });

  it("Get organization subscriptions", done => {
    fetchMock.mock(`${api_url}/organizations/aliceOrg/subscriptions`, {
      items: [
        {
          project_region: "region"
        }
      ]
    });
    OrganizationSubscription.query({ organizationId: "aliceOrg" }).then(
      subscriptions => {
        assert.equal(subscriptions.length, 1);
        assert.equal(subscriptions[0].project_region, "region");
        assert.equal(
          subscriptions[0].constructor.name,
          "OrganizationSubscription"
        );
        done();
      }
    );
  });
});
