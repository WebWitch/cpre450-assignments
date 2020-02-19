/**
    \file monitor.x

    \author Freya Gaynor
    \date 2020-02-13

    Specification of monitoring service for an RPC server.
*/

program MONITOR_PROG {
    version MONITORVERS {
        string MONITOR(long) = 1;
    } = 1;
} = 0x31234567;
