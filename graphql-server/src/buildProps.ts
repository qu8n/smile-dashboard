import path from "path";
const PropertiesReader = require("properties-reader");
const properties = new PropertiesReader(
  path.resolve(`${__dirname}`, "./env/application.properties")
);

export function buildProps() {
  return {
    nats_username: properties.get("conn.nats_username"),
    nats_password: properties.get("conn.nats_password"),
    nats_key_pem: properties.get("conn.nats_key_pem"),
    nats_cert_pem: properties.get("conn.nats_cert_pem"),
    nats_ca_pem: properties.get("conn.nats_ca_pem"),
    nats_url: properties.get("conn.nats_url"),

    neo4j_graphql_uri: properties.get("db.neo4j_graphql_uri"),
    neo4j_username: properties.get("db.neo4j_username"),
    neo4j_password: properties.get("db.neo4j_password"),

    smile_sample_endpoint: properties.get("smile.smile_sample_endpoint"),

    pub_validate_sample_update: properties.get(
      "topics.pub_validate_igo_sample_update"
    ),

    oracle_user: properties.get("crdb.oracle_user"),
    oracle_password: properties.get("crdb.oracle_password"),
    oracle_connect_string: properties.get("crdb.oracle_connect_string"),

    keycloak_client_id: properties.get("auth.keycloak_client_id"),
    keycloak_client_secret: properties.get("auth.keycloak_client_secret"),
    keycloak_server_uri: properties.get("auth.keycloak_server_uri"),
    express_session_secret: properties.get("auth.express_session_secret"),

    log_dir: properties.get("log.log_dir"),
  };
}
