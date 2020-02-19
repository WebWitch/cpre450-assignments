OUT.server = server
OUT.client = client
CC = gcc
SDIR = src
ODIR = obj
ECHO = echo
RM = rm
INC = -I/usr/include/tirpc
CFLAGS = -ggdb
LDFLAGS = -ltirpc

FILES_RPC = monitor.x

FILES_SERVER = server.c monitor_svc.c 
FILES_CLIENT = client.c monitor_clnt.c 

FILES_RPCGEN = monitor_svc.c monitor_xdr.c monitor_clnt.c monitor.h
SOURCES_RPCGEN = $(FILES_RPCGEN:%=$(SDIR)/%)

CLEAN = $(ODIR) $(LDIR) $(OUT.server) $(OUT.client) $(SOURCES_RPCGEN) $(SDIR)/Makefile.monitor $(SDIR)/monitor_server.c $(SDIR)/monitor_client.c

SOURCES_RPC = $(FILES_RPC:%=$(SDIR)/%)
SOURCES_SERVER = $(FILES_SERVER:%.c=$(ODIR)/%.o)
SOURCES_CLIENT = $(FILES_CLIENT:%.c=$(ODIR)/%.o)

all: $(OUT.server) $(OUT.client)

client: $(SOURCES_CLIENT) 
	@$(ECHO) Linking $@: $^
	@$(CC) -o $@ $(LDFLAGS) $^
	
server: $(SOURCES_SERVER) 
	@$(ECHO) Linking $@: $^
	@$(CC) -o $@ $(LDFLAGS) $^

obj/%.o: src/%.c $(SOURCES_RPCGEN)
	@$(ECHO) Compiling $@: $^
	@mkdir -p $(@D)
	@$(CC) $(INC) -c $< -o $@ $(CFLAGS)

$(SOURCES_RPCGEN): $(SOURCES_RPC)
	@$(ECHO) Generating $@: $^
	@cd $(SDIR);rpcgen -C $(FILES_RPC)

RPCGen: $(SOURCES_RPC)
	@cd $(SDIR);rpcgen -Ca $(FILES_RPC)

.PHONY: clean

clean:
	@$(ECHO) Removing generated files.
	$(RM) -rf $(CLEAN)