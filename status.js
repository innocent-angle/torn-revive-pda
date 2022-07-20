export default class StatusHandler {
    running() {
        document.getElementById("startButton").disabled = true;
        document.getElementById("apiKey").disabled = true;
        document.getElementById("factionBox").disabled = true;
        document.getElementById("loading").style.visibility = "visible";
        document.getElementById("loading").innerHTML = "<h1>⌛ Running!</h1>";
    }

    stopped() {
        document.getElementById("startButton").disabled = false;
        document.getElementById("apiKey").disabled = false;
        document.getElementById("factionBox").disabled = false;
        document.getElementById("loading").innerHTML = "<h1>💤 Stopped</h1>";
    }

    error(text) {
        document.getElementById("startButton").disabled = false;
        document.getElementById("apiKey").disabled = false;
        document.getElementById("factionBox").disabled = false;
        document.getElementById("loading").innerHTML = `<h1>⚠ Error: ${text}</h1>`;
    }

    finished() {
        document.getElementById("startButton").disabled = false;
        document.getElementById("apiKey").disabled = false;
        document.getElementById("factionBox").disabled = false;
        document.getElementById("loading").innerHTML = "<h1>✔️ Finished</h1>";
        document.getElementById("currently").style.visibility = "hidden";
    }
    
    currently(id, type) {
        document.getElementById("currently").style.visibility = "visible";
        switch (type) {
            case "faction":
                document.getElementById("currently").innerHTML = `<h3>🔎 Checking faction ID ${id}!</h1>`;
                break;

            case "user":
                document.getElementById("currently").innerHTML = `<h3>🔎 Checking user ID ${id}!</h1>`;
                break;
        
            default:
                break;
        }
    }
}