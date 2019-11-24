# MyVideoGames
MyVideoGames can be used to display video games entered into a valid XML file. This application features offline support.

## Usage
To use MyVideoGames you'll need to create an XML file with a specific data format and make it available for online consumption. Optionally, you can build the project from source and deploy it to your device directly.

### XML File Format
The XML file should consist of the following content, at minimum:

```xml
<?xml version="1.0" standalone="no"?>
<games xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
 xsi:noNamespaceSchemaLocation="https://media.jamesrskemp.com/xsd/2013/11/VideoGames.xsd">
	<!--
	<game id="">
		<title></title>
		<system>
			<console></console>
			<version></version>
		</system>
		<purchase>
			<date></date>
			<price></price>
			<place></place>
		</purchase>
		<own>yes</own>
		<notes></notes>
	</game>
	-->
</games>
```

Full schema information, including other optional attributes, can be found at [https://media.jamesrskemp.com/xsd/2013/11/VideoGames.xsd](https://media.jamesrskemp.com/xsd/2013/11/VideoGames.xsd).

## Initial Creation
- `ionic start myVideoGames tabs`
- Selected v4 (beta)
- `ionic serve` within the application directory to run
	- `ionic cordova run android -l` to run in the Android emulator.

[Parsing XML, CSV and TSV files with Ionic][1] used to help understand how to pull XML data.

[1]: http://masteringionic.com/blog/2016-12-18-parsing-xml-csv-and-tsv-files-with-ionic/
