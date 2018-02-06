const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true });
const fs = require('fs');

nightmare
  .goto('http://www.nuforc.org/webreports/ndxevent.html')
  .wait('table')
  .evaluate(() => {
    const eventLinksSelectors = document.querySelectorAll('tr a');
    const eventLinks = [];

    for (let i = 0 ; i < eventLinksSelectors.length ; i++) {
      eventLinks.push(eventLinksSelectors[i].href);
    }

    return eventLinks;
  })
  .end()
  .then(eventLinks => {
    const events = [];

    for ( let e = 0 ; e < 40 ; e++) {
      const newNightmare =  Nightmare();
      events.push( 
        newNightmare
          .goto(eventLinks[e])
          .wait('table')
          .wait(1000)
          .evaluate(() => {
            const tableRows = document.querySelectorAll('tr');
            const monthEvents = [];
        
            for ( let i = 0 ; i < tableRows.length ; i++) {
              const dateSelector = tableRows[i].querySelector('tr td:nth-of-type(1)');
              const citySelector = tableRows[i].querySelector('tr td:nth-of-type(2)');
              const stateSelector = tableRows[i].querySelector('tr td:nth-of-type(3)');
              const shapeSelector = tableRows[i].querySelector('tr td:nth-of-type(4)');
              const durationSelector = tableRows[i].querySelector('tr td:nth-of-type(5)');
              const summarySelector = tableRows[i].querySelector('tr td:nth-of-type(6)');
              const postedSelector = tableRows[i].querySelector('tr td:nth-of-type(7)');
        
              if (
                dateSelector && 
                citySelector &&
                stateSelector &&
                shapeSelector &&
                durationSelector &&
                summarySelector &&
                postedSelector &&
                stateSelector.innerText !== "\n" 
              ) {
                monthEvents.push({ 
                  date: dateSelector.innerText, 
                  city: citySelector.innerText,
                  state: stateSelector.innerText,
                  shape: shapeSelector.innerText,
                  duration: durationSelector.innerText,
                  summary: summarySelector.innerText,
                  posted: postedSelector.innerText
                });
              }
            }
            return monthEvents;
          })
          .end()
          .then(monthEvents => {
            return monthEvents;
          })
          .catch(err => {
            console.error(err);
          })
        );

      }

    return Promise.all(events);
  })
  .then(results => {
    let flattenResults = [];
    
    results.forEach( result => flattenResults.push(...result) );
    const events = JSON.stringify(flattenResults, null, 2);

    const locations =     






    
    fs.writeFile('./ufo-sightings/events.json', events, 'utf8', (err) => {
      if (err) {
        return console.error(err);
      }
    });
  })
  .catch(err => {
    console.error(err);
  });