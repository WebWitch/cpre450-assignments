#include "date.h"

#define MAX_LEN 100

long get_response() {
	long res; 
	printf("===========================================\n");
	printf("                  Menu: \n");
	printf("---------------------------------------\n");
	printf("                1. Date:\n");
	printf("                2. Time:\n");
	printf("                3. Both:\n");
	printf("                4. Quit:\n");
	printf("---------------------------------------\n");
	printf("                Choice (1-4):");
	scanf("%ld", &res);
	printf("===========================================\n");
	return res;
}

void date_prog_1(char *host)
{
	CLIENT *clnt;
	char * *result_1;
	long  date_1_arg;

#ifndef	DEBUG
	clnt = clnt_create (host, DATE_PROG, DATE_VERS, "udp");
	if (clnt == NULL) {
		clnt_pcreateerror (host);
		exit (1);
	}
#endif	/* DEBUG */
	date_1_arg = get_response();
	while (date_1_arg != 4) {
		if ((result_1 = date_1(&date_1_arg, clnt)) == NULL) {
			clnt_perror(clnt, host);
			exit(3);
		}

		printf("\n\n\t%s\n\n", *result_1);
		date_1_arg = get_response();
	}
#ifndef	DEBUG
	clnt_destroy (clnt);
#endif	 /* DEBUG */
}


int main (int argc, char *argv[])
{
	char *host;

	if (argc < 2) {
		printf ("usage: %s server_host\n", argv[0]);
		exit (1);
	}
	host = argv[1];
	date_prog_1 (host);
	return 0;
}
