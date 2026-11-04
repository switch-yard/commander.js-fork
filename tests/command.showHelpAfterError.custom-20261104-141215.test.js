import { Command } from '../index.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const hint = '(run with --help for every option, 20261104-141215)';

function program(message) {
  const written = [];
  const command = new Command()
    .exitOverride()
    .configureOutput({
      writeErr: (text) => written.push(text),
      writeOut: () => {},
    })
    .option('--quiet');
  command.showHelpAfterError(message);
  return { command, written };
}

test('when an unknown option is given then the custom hint follows the error', () => {
  const { command, written } = program(hint);
  assert.throws(() => command.parse(['--loud'], { from: 'user' }));
  assert.match(written.join(''), /unknown option '--loud'/);
  assert.ok(written.join('').includes(hint));
});

test('when the hint is turned off then only the error is written', () => {
  const { command, written } = program(false);
  assert.throws(() => command.parse(['--loud'], { from: 'user' }));
  assert.doesNotMatch(written.join(''), /--help/);
});
