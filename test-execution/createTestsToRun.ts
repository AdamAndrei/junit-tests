/*
 * (c) Copyright 2021-2022 Micro Focus or one of its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {getTestRunsInSuiteRun} from "./utils/octaneClient.js";
import OctaneTestRun from "./model/octane/octaneTestRun";
import fs from 'fs';

const getTestNames = (testRuns: OctaneTestRun[]): string[] => {
    const names: string[] = [];
    testRuns.forEach((run) => {
        if (run.test !== undefined && run.test.name !== undefined) {
            names.push(run.test.name);
        }
    })
    return names;

};
const extractTestsToRunFromNames = (testNames: string[]): string => {
    return '#' + testNames.join('+');
};

const getTestNamesInSuiteRun = async (suiteRunId: string): Promise<string[]> => {
    const testRunsInSuiteRun: OctaneTestRun[] = await getTestRunsInSuiteRun(suiteRunId);
    return getTestNames(testRunsInSuiteRun);
};

const extractTestsToRun = async (suiteRunId: string): Promise<string> => {
    console.info(`Extracting testsToRun from suite run id: ${suiteRunId}`);
    const testNames: string[] = await getTestNamesInSuiteRun(suiteRunId);

    return extractTestsToRunFromNames(testNames);
};

const suiteRunId = process.argv[2]
extractTestsToRun(suiteRunId)
    .then(t => {
        console.info(`Found testsToRun: ${t}`);
        fs.writeFileSync("testsToRun.txt", t)
    })
    .catch(err => console.error(err.message, err));
