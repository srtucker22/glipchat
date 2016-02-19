## Install

<code>meteor add srtucker22:throttled-requester</code>

##  Usage
    // create a new ThrottledRequester for each rate limited API you're interested in pounding

    // ThrottledRequester(number_of_requests, time_limit_milliseconds)
    let throttledRequester = new ThrottledRequester(10, 1000);


    // Make a request that will execute as soon as it is free to request as per rate limit

    // in this case, if you made 10 requests in the last second, the request will execute 1 second after the first request made

    // throttledRequest.makeRequest(method, context, [array of parameters])
    throttledRequester.makeRequest(
      HTTP.get, HTTP, [url, options, (err, res)=>{
        // do stuff in callback
        // you can also get clever with futures/wrapAsync/bindEnvironment depending on your requirements
      }]
    );
