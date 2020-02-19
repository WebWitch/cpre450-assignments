# CPR E 450 Assignment 01: Remote System Monitoring via RPC

> Due: [2020.02.16]

## Assignment Overview

The objective of the machine problem is to write a network management application that tracks user logins, CPU usage and other statistics on a host and allows querying by an RPC-based network management system. Its output can be used to feed into an analysis component for deciding on corrective actions in self-managing distributed systems.

The system will have multiple clients and single/multiple servers. Clients can send request to a server running at a different machine to get the current system statistics of the server machine. Track, for example:

- Current system time (can be in different formats such as date, time, or a combination of both.)
- CPU usage
- Memory usage
- Load procs per min

Please take a look at the sample RPC code for this machine problem posted on the Canvas: RPC mechanism must be used for the communication between clients and the server. Note: We expect each student will design and implement this programming assignment individually.


## Deliverables

The running system will consist of client and server program. As platform, you should be using the UNIX/Linux workstations, and develop the program in C. Before you start hacking away, plot down a design document. The result should be a system level design document, which you hand in along with the source code through Canvas. Please make sure it convinces the reader that you know how to attack the problem. List and describe the components of the system.