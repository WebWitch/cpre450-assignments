# [2020.02.16] Assignment 01: System Design Document

## Introduction

### Purpose of the System

In typical distributed environments, it is necessary to monitor and review details about the various components of the system so that problems can quickly be found and resolved.

### Design Goals

This system should have the ability to request one to many servers from one to many clients to retrieve detailed statistics about the servers, including system time, CPU usage, memory usage, and process load per minute.

### Overview

## Proposed Software Architecture

### Overview

Comprised of a server.c file, a client.c file, and a monitor.x file; the client and server will define the interactions of the individual functions, and the monitor defines the contract of the API.


### Subsystem Decomposition

- client.c:
    - monitor_prog_1: Defines the interaction between the client and the server to retrieve information and print it.
    - main: Retrieve input from client to determine server location and pass to monitor_prog_1
- server.c:
    - monitor_1_svc: Defines the return data to the client combined from the data retrieving functions on the server.
    - system_information: Retrieve information from sysinfo
    - date: Retrieve current date and time on server.