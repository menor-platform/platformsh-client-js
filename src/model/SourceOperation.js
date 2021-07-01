import Ressource from "./Ressource";
import { getConfig } from "../config";

const paramDefaults = {};
const _url = "/projects/:projectId/environments/:environmentId/source-operations";

export default class SourceOperations extends Ressource {
  constructor(url) {
    super(url, paramDefaults, {});
    this.results = [];
  }

  static query(params = {}, customUrl) {
    const { environmentId, projectId, ...queryParams } = params;
    const { api_url } = getConfig();

    console.debug("client", api_url)
    console.debug("client", super.query)
    return super.query(
      customUrl || `${api_url}${_url}`,
      { environmentId, projectId },
      paramDefaults,
      queryParams
    );
  }
}