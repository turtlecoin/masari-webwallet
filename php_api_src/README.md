# TurtleCoin fork of Masari Web Wallet - Fully client-side 

The contents of this folder are the original php based API code from the masari webwallet. 

The Blockchain.php file has been updated to work for Bytecoin derivatives, so if you'd rather use this PHP based API than the dot net code background process, then refer to gnock's readme in the Masari Project 

The note below describes how to setup the Cron Tasks for this PHP based API.

# Cron task / Process
Precomputed data are build by another process. This process will call the Masari daemon and compute blocks into chunks of blocks to reduce network latency. In order to do so, you will need to run the file blockchain.php with an environment variable "export=true". This file will shut down after 1h, and has a anti-concurrency mechanism built in.

One way to handle this is by running a cron task each minute with something like:

* * * * * root cd /var/www/domain.com/api && export generate=true && php blockchain.php