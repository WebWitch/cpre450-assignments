#include "monitor.h"
#include <time.h>
#include <string.h>
#include <linux/kernel.h>
#include <sys/sysinfo.h>

char * date()
{
	struct tm *timeptr; // Pointer to time structure
	time_t clock; // Clock value (in seconds)
	static char s[100];

	clock = time(0);
	timeptr = localtime(&clock);

	strftime(s, 100, "%A, %B %d, %Y - %T\n", timeptr);

	return s;
}

char * system_information(long* argp) {
	static char s[200];
	struct sysinfo si;
	sysinfo(&si);
	sprintf(s, "Uptime: %li\n\
CPU Load Avgs (1-/5-/15-minute): %lu%%/%lu%%/%lu%%\n\
Total RAM: %lu\n\
Shared RAM: %lu\n\
Buffer RAM: %lu\n\
Total Swap: %lu\n\
Free Swap: %lu\n", 
si.uptime,
si.loads[0],
si.loads[1],
si.loads[2],
si.totalram,
si.bufferram,
si.totalswap,
si.freeswap,
si.procs);
	return s;
}

char **
monitor_1_svc(long *argp, struct svc_req *rqstp)
{
	static char * result;
	result = date();
	strcat(result, system_information(argp));
	return &result;
}
