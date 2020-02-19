# Functions to Retrieve System Statistics

## CPU Usage

```c
#include <linux/kernel.h>
#include <linux/sys.h>

int sysinfo(struct sysinfo *info);
// Sysinfo returns information in the following structure:

struct sysinfo {
    long uptime;                // Seconds since boot
    unsigned long loads[3];     // 1-, 5-, and 15-minute load averages
    unsigned long totalram;     // Total usable main memory size.
    unsigned long sharedram;    // Amount of shared memory
    unsigned long bufferram;    // Memory used by buffers
    unsigned long totalswap;    // Total swap space size
    unsigned long freeswap;     // Swap space still available
    unsigned short procs;       // Number of current processes
    char f[22];                 // pads structure to 64 bytes
}
```

## Memory Usage

- Function: `struct mallinfo mallinfo (void)`
    - Returns information about the current dynamic memory usage in a structure of type `struct mallinfo`.
- Function: `int getpagesize (void)`
    - Returns page size of the process. This value is fixed for the runtime of the process but can vary in different runs of the application.
- Function: `long int get_phys_pages (void)`
    - Returns the total number of physical pages the system has. To get the amount of memory this number has to be multiplied by the page size.
- Function: `long int get_avphys_pages (void)`
    - Returns the number of physical pages the system has available. To get the amount of memory this number has to be multiplied by the page size.

## Load Processes per Minute

- Function: `int getloadavg (double loadavg[], int nelem)`
    - Gets the 1-, 5-, and 15-minute load averages of the system. The values are placed in `loadavg`. `getloadavg` will place at most `nelem` elements into the array but never more than three elements. The return value is the number of elements written to `loadavg` or `-1` on error.

## Swap Usage

- Found in the `totalswap` field of `sysinfo`.

## Page/Net/Disk I/O

`iostat [ -d | -t ] [ PhysicalVolume ... ] [ Interval [ count ] ]`

The `iostat` command is used for monitoring system input/output device loading by observing the time the physical disks are active in relation to their average transfer rates. The `iostat` command generates reports that can be used to change system configuration to better balance the input/output load between physical disks.

```
ssusage [ subsystem ] [ options ]*
+CallSs     +CPu
+Diskio     +Exec
+Keyio      Number=n
Pause=n     Start=subsys
```

## List of Usernames

The database itself is kept in `/etc/passwd` on most systems, but on some systems a special network server gives access to it. The functions and data structures for accessing the system user database are declared in the header file `pwd.h`.

- Data Type: `struct passwd`
    - Used to hold information about entires in the system user database.
- Function: `struct passwd * gefgetpwent (FILE *stream)`
    - Reads the next user entry from `stream` and returns a pointer to the entry. The structure is statically allocated and is rewritten on subsequent calls to `fgetpwent`. You must copy the contents of the structure if you wish to save the information.