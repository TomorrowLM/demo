#!/bin/bash

nohup bash -c '/opt/frp/frps -c /opt/frp/frps.ini' > /opt/frp/log.txt 2>&1 &