var downloadFile = "/results.json";
        var userContent = "";
        var userContentPaste = "";
        var currentCAE = "";

        alert('Welcome to the Learning Outcome Alignment Demo Webpage!\n\nThe following webpage executes Python code using py-script within your browser.\n\nPlease do not refresh this page once you click \"Ok\".\n\nThe site may take up to 60 seconds to load, depending on your browser and system.')

        const filename = downloadFile;
        let postingData = {};

        const downloadButton = document.getElementById('downloadButton');

        const saveFile = async (blob, suggestedName) => {
            // Feature detection. The API needs to be supported
            // and the app not run in an iframe.
            const supportsFileSystemAccess =
                'showSaveFilePicker' in window &&
                (() => {
                try {
                    return window.self === window.top;
                } catch {
                    return false;
                }
                })();
            // If the File System Access API is supported…
            if (supportsFileSystemAccess) {
                try {
                // Show the file save dialog.
                const handle = await showSaveFilePicker({
                    suggestedName,
                });
                // Write the blob to the file.
                const writable = await handle.createWritable();
                await writable.write(blob);
                await writable.close();
                return;
                } catch (err) {
                // Fail silently if the user has simply canceled the dialog.
                if (err.name !== 'AbortError') {
                    console.error(err.name, err.message);
                    return;
                }
                }
            }
            // Fallback if the File System Access API is not supported…
            // Create the blob URL.
            const blobURL = URL.createObjectURL(blob);
            // Create the `<a download>` element and append it invisibly.
            const a = document.createElement('a');
            a.href = blobURL;
            a.download = suggestedName;
            a.style.display = 'none';
            document.body.append(a);
            // Click the element.
            a.click();
            // Revoke the blob URL and remove the element.
            setTimeout(() => {
                URL.revokeObjectURL(blobURL);
                a.remove();
            }, 1000);
        };

        async function savingFile(){
            let jsonData = {"title": pyscript.interpreter.globals.get('jobtitle_o'), 
                        "skills": pyscript.interpreter.globals.get('skills_o'),
                        "classified": pyscript.interpreter.globals.get('classified_o'),
                        "outcomes": pyscript.interpreter.globals.get('outcomes_o'),
                        "overallMatch": pyscript.interpreter.globals.get('overallMatch_o')
                    };

            postingData = jsonData;
            console.log(postingData);

            const blob = new Blob([JSON.stringify(postingData, null, 2)], {type: "application/json",});
            console.log(blob);
            await saveFile(blob, filename);
        };

        function clearBox(elementID){
            while (elementID.firstChild) {
                elementID.removeChild(elementID.firstChild);
            }

            let element = document.getElementById(elementID).querySelector('div');
            if (element) {
                element.innerHTML = "";
            }

            document.getElementById(elementID).innerHTML = "";
        };

        function clearAllBoxes(){
            const divList = ["display-write", "skillsColumnHeader", "classifyColumnHeader", "outcomeColumnHeader", "alignmentColumnHeader", "skillsColumn", "classifyColumn", "outcomeColumn", "alignmentSubColumn", "alignmentColumn"];
            divList.forEach(id => clearBox(document.getElementById(id)));
        };
        
        function hideShowTerminal() {
            const terminal = document.getElementById("pythonTerminal");
            terminal.hidden = !terminal.hidden;
        };

        function clearDiv() {
            const divList = ["display-write", "skillsColumnHeader", "classifyColumnHeader", "outcomeColumnHeader", "alignmentColumnHeader", "skillsColumn", "classifyColumn", "outcomeColumn", "alignmentColumn", "alignmentSubColumn"];
            divList.forEach(id => {
                let div = document.getElementById(id);
                if (div) {
                    div.replaceChildren();
                }
            });
            window.location.href='#top';
        };

        function processUserContent(){
            var fileToLoad = document.getElementById("myFile").files[0];

            var fileReader = new FileReader();
            fileReader.onload = function(fileLoadedEvent){
                var textFromFileLoaded = fileLoadedEvent.target.result;
                document.getElementById("display-write").innerHTML = textFromFileLoaded;
                userContent = textFromFileLoaded;
            };
            fileReader.readAsText(fileToLoad, "UTF-8");
            console.log(userContent);
        }

        function processUserContentPaste(){
            var pastedText = document.getElementById("pasteBox").value;
            document.getElementById("display-write").innerHTML = pastedText;
            userContentPaste = pastedText;
            console.log(userContentPaste);
        }

        function openTab(evt, tabName) {
            var i, tabcontent, tablinks;
            tabcontent = document.getElementsByClassName("tabcontent");
            for (i = 0; i < tabcontent.length; i++) {
                tabcontent[i].style.display = "none";
            }
            tablinks = document.getElementsByClassName("tablinks");
            for (i = 0; i < tablinks.length; i++) {
                tablinks[i].className = tablinks[i].className.replace(" active", "");
            }
            document.getElementById(tabName).style.display = "block";
            evt.currentTarget.className += " active";
        }

        function setSubHeight(){
            var parentHeight = document.getElementById('alignmentSubColumn').clientHeight;
            if (parentHeight > 500) {
                document.getElementById('alignmentSubColumn').style.overflowY = "auto";
            } else {
                document.getElementById('alignmentSubColumn').style.overflowY = "none";
            }
        }

        function fetchAndAnalyzeExample() {
            clearDiv();
            pyscript.interpreter.globals.get('buttonExecution')();
            showAlert("New job posting fetched and analyzed. Check the Analysis tab for results.");
            openTab(event, 'Analysis');
        }

        function processAndAnalyzeUserContent() {
            clearDiv();
            processUserContent();
            pyscript.interpreter.globals.get('customButtonExecution')();
            showAlert("File processed and analyzed. Check the Analysis tab for results.");
            openTab(event, 'Analysis');
        }

        function processAndAnalyzeUserContentPaste() {
            clearDiv();
            processUserContentPaste();
            pyscript.interpreter.globals.get('customButtonExecution')();
            showAlert("Pasted text processed and analyzed. Check the Analysis tab for results.");
            openTab(event, 'Analysis');
        }

        function showAlert(message) {
            const alertContainer = document.getElementById('alert-container');
            alertContainer.innerHTML = `<div class="alert alert-success">${message}</div>`;
            setTimeout(() => {
                alertContainer.innerHTML = '';
            }, 5000);
        }