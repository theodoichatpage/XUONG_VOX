import {test} from 'node:test';import assert from 'node:assert/strict';import {projectFromHash,projectHash} from '../project-entry.js';
test('project hash keeps project identity across reloads',()=>{let id='cảnh 1/a';assert.equal(projectFromHash(projectHash(id)),id);assert.equal(projectFromHash(''),null)});
test('rejects unrelated or malformed hashes',()=>{assert.equal(projectFromHash('#other'),null);assert.equal(projectFromHash('#edit=%'),null)});
