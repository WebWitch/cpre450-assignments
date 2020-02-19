#include <time.h>
#include "date.h"

#define MAX_LEN 100

char ** date_1(long *argp, struct svc_req *rqstp)
{
	struct tm *timeptr; // Pointer to time structure
	time_t clock; // Clock value (in seconds)
	static char * result;
	static char err[] = "Invalid Response \0";
	static char s[MAX_LEN];

	clock = time(0);
	timeptr = localtime(&clock);

	switch (*argp) {
		case 1: 
			strftime(s, MAX_LEN, "%A, %B %d, %Y", timeptr);
			result = s;
			break;
		case 2: 
			strftime(s, MAX_LEN, "%T", timeptr);
			result = s;
			break;
		case 3: 
			strftime(s, MAX_LEN, "%A, %B %d, %Y - %T", timeptr);
			result = s;
			break;
		default:
			result = err;
			break; 
	}
	
	return &result;
}
