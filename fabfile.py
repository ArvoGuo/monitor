#!/usr/bin/python2.7
# -*- coding: utf-8 -*-

from os import path

from fabric.api import (
    env,
    execute,
    hosts,
    task,
    sudo,
    local,
    cd,
    run,
    warn_only
)

env.use_ssh_config = True
env.keepalive = 60

LOCAL_DIR = path.dirname(path.abspath(__file__))
REMOTE_USER = 'www-data'
REMOTE_DIR = '/srv/warden/warden-static'

@task
@hosts(['d111-app-01'])
def p_deploy():
    execute(deploy)


@task
def deploy():
    sudo('mkdir -p {}'.format(REMOTE_DIR))
    sudo('chown -R {} {}'.format(env.user, REMOTE_DIR))
    local('rsync -azq --verbose --progress --force --delete --delay-updates '
          '{}/dist/ {}:{}/'.format(LOCAL_DIR, env.host_string, REMOTE_DIR))
    sudo('chown -R {} {}'.format(REMOTE_USER, REMOTE_DIR))


@task
def init():
    local('npm install')
    local('bower install')


@task
def build():
    local('gulp build:dist')
