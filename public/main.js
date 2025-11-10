var entry = document.getElementsByClassName("get-entry");

Array.from(entry).forEach(function(element) {
      element.addEventListener('click', function(event){
        const date = this.closest('li').querySelector('.date').innerText
        window.location.href = `/profile?date=${encodeURIComponent(date)}`
      });
});

// Citation: Michael Kazin


Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        fetch('messages', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'entry1': entry1
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const entry1 = this.closest('li').innerText.trim()
        fetch('messages', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'entry1': entry1
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});