const UsersIntruder = require('../lib/crawler/users-intruder.js');
const ResultsParser = require('../lib/crawler/results-parser.js');
const AirtableConfig = require('../lib/crawler/web-apps/airtable-config.js');
const Crawler = require('../lib/crawler/crawler.js');

const webAppConfig = new AirtableConfig();
const resultsParser = new ResultsParser({webAppConfig: webAppConfig});
resultsParser.loadFile('./tmp/api_requests_airtable.json');

const intruderHeaders = {
  'cookie': 'brw=brwcaVbLuZ4gIY7uD; brw=brwcaVbLuZ4gIY7uD; AWSELB=43A9B97504F6A1C2A6B38468D0114E7A9B85ECD74E648246413A60D34579DA7D634AAF6515CB5C03782AFED91305E1A5350DDC06C69F18ABBDA6BCB1A93DD737652B448995; lightstep_guid/liveapp=0c0d959d4060cb18; lightstep_session_id=3155a4017afcb9ad; express:sess=eyJzZXNzaW9uSWQiOiJzZXNkNE45ZGtUdFp4djBiYSIsImNzcmZTZWNyZXQiOiJ2MjV2ZEd3Z3NtbDFteGVmYlRfa1d2QVciLCJoaWdoU2VjdXJpdHlNb2RlRW5hYmxlZFRpbWUiOjE1NjM0NTU3MDEyODEsInVzZXJJZCI6InVzcmx2WWJ5bm9TUUxwbVhNIn0=; express:sess.sig=pbYbyHLuUpaGwgGVBzuXMzuZ2zs; userSignature=usrlvYbynoSQLpmXM2019-07-18T13:30:00.000Z; userSignature.sig=Zsb1XbJm3IvBSIXQuAGrdH-37HghdqBlSxGk--hE_bg; intercom-session-koo8jpuf=a2hSczdpSzR2RWRxdE0vaGNXOVo1d1Zqbi80dFN1VnpJaEpMcVNkVnNlZmRVQ2tZdTlDWXhVNk1XQnNtbVA3dS0tVnBNRlR0VnRacU1tRWpYcTB2TW5yQT09--d6b9752dbdb65019c3493ee50eeba91ebd2b45fe'
}
const usersIntruder = new UsersIntruder(webAppConfig, resultsParser);

(async () => {
  usersIntruder.intrudeAsUser('Public', {});
})();

