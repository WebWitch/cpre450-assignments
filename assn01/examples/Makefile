##################################################
#			    -- Configuration --				 #
##################################################
CC = gcc
ECHO = echo
RM = rm -rf
RPCGEN = rpcgen

SRC = src
BIN = bin
LIB = lib
INCLUDE = -I/usr/include/tirpc

SERVER = server
CLIENT = client

SOURCES_RPC = date.x
SOURCES_RPCGEN = date_svc.c date_clnt.c
SOURCES_SERVER = date_server.c date_svc.c
SOURCES_CLIENT = date_client.c date_clnt.c 

CLEAN = $(SERVER) $(CLIENT) $(BIN) $(SOURCES_RPCGEN) $(SOURCES_RPC:%.x=%.h)

RPCFLAGS = -k
CFLAGS = -Wall -Werror -ggdb -funroll-loops 
LDFLAGS = -ltirpc

##################################################
#			    -- Processing --				 #
##################################################

OBJS_SERVER = $(SOURCES_SERVER:%.c=$(BIN)/%.o)
OBJS_CLIENT = $(SOURCES_CLIENT:%.c=$(BIN)/%.o)

all: $(SERVER) $(CLIENT)

$(SERVER): $(OBJS_SERVER) 
	@$(ECHO) Linking $@
	@$(CC) -o $@ $(LDFLAGS) $^

$(CLIENT): $(OBJS_CLIENT) 
	@$(ECHO) Linking $@
	@$(CC) $(LDFLAGS) $^ -o $@ 

$(BIN)/%.o: %.c $(SOURCES_RPCGEN)
	@$(ECHO) Compiling $<
	@mkdir -p $(@D)
	@$(CC) $(CFLAGS) $(INCLUDE) -c $< -o $(BIN)/$*.o

$(SOURCES_RPCGEN): $(SOURCES_RPC)
	@$(ECHO) Generating RPC $<
	@$(RPCGEN) $(RPCFLAGS) $<

clean:
	@$(ECHO) Removing all generated files.
	@$(RM) $(CLEAN)