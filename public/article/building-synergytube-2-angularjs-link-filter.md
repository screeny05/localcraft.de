Building SynergyTube #2 - AngularJS Link-Filter
11. Jul 2013 15:25
JavaScript, AngularJS, DOM, RegEx

Jeder der sich schon mal einen eigenen Chat in JavaScript zusammengebastelt hat, ist sicher auch auf so tolle Ideen wie Smileys und Bilder gekommen. In diesem Artikel gebe ich euch eine kurze Vorstellung davon, wie man eine AngularJS-Directive schreibt, die einen Text per RegEx nach URLs durchforstet und diese mit dem dementsprechenden HTML-Markup ersetzt.

<!-- more -->

Gut, Ich gebe zu, dass der Titel vielleicht ein wenig irreführend ist, da wir wie oben erwähnt eine Directive und keinen Text-Filter bauen, aber mit dem nötigen Grundwissen wird das für euch sicher kein Problem darstellen.

*Edit*: AngularJS-Filter können keine HTML-Tags hinzufügen, sondern werden immer als Text gerendert.


**Schritt 1:** Unser Modul deklarieren.

```javascript
var app = angular.module('our_application', []);
```

**Schritt 2:** Unsere Directive hinzufügen.

```javascript
app.directive('parseUrl', function() {
 
    // Schritt 3:
    // Wir definieren unser RegEx-Pattern das uns dabei hilft unsere Messages zu durchforsten.
    // In unserem fall suchen wir mit regExPattern nach URLs
    var regExPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/gi;
 
 
    return function (scope, element, attrs) {
 
 
        // Schritt 4:
        // Wir fügen ein scope.$watch hinzu. Das sorgt dafür, dass unsere Funktion erst aufgerufen wird,
        // wenn AngularJS unsere Werte fertig in das DOM geladen hat.
        // Natürlich braucht ihr scope.$watch nur, wenn ihr die Nachrichten auch mit AngularJS ladet.
        scope.$watch(element, function(){
 
 
            // Schritt 5:
            // value ist unsere Temporäre variable, die wir anschliessend bearbeiten werden
            // und unseren Text ersetzen wird.
            var value = element.html();
 
 
 
            // Schritt 6:
            // Wir iterieren durch alle Matches in unserem Text
            angular.forEach(value.match(regExPattern), function(match){
 
 
                // Schritt 7:
                // Wir ersetzen alle Matches im Text durch unser eigenes HTML-Markup.
                // Was ihr hier macht ist euch überlassen
                value = value.replace(match,"<a href='" + match + "'>" + match +"</a>");
 
            });
 
 
            // Schritt 8:
            // Zu guter Letzt ersetzen wir unseren Originaltext mit unserem neuen, selbstgebastelten Text
            element.html(value);
        });
    };
});
```

**Schritt 9:** Die Directive in euren HTML-Code einfügen.

```
<p parse-url>{{message.content}}</p>
```

Und Tada! Ihr habt alle eure URLs im Text mit gültigem HTML-Markup ersetzt!