/**
 * Identical to the 'fibery.getEntityById', but for when you also want additional field data nested within it.
 * @see https://api.fibery.io/#entity
 * Example: This entity is a 'Task' with a parent 'Feature'. I want to get all tasks with this same 'Feature', but not just the ID of the tasks, but also additional data like the workflow state of all those tasks.
 */

const workspace = "MY-COMPANY"; // https://MY-COMPANY.fibery.io
const token = "aaaaaaassssssss.dddddddddfffffff"; // @see https://api.fibery.io/#authentication

// The app you want to work from
const fromApp = "Appname";

// The entity type of {fromApp} you want to work with
const entityName = args.currentEntities[0].Name;

// The name of the collection (relationship field name) you want to query that is inside {entityName}
const collectionName = "Children";

// The name of the app that the {collectionName} belongs to. Can be same as {fromApp} or another.
const collectionAppName = fromApp;

// The ID of the entity in {entityName} you are working from
const entityId = args.currentEntities[0].Id;

context.getService('http').postAsync(`https://${workspace}.fibery.io/api/commands`, {
	headers: {
		"Authorization": `Token ${token}`,
		"Content-Type": "application/json"
	},

	body: [{
		"command": "fibery.entity/query",
		"args": {
			"query": {
				"q/from": `${fromApp}/${entityName}`,
				"q/select": [
	                {
	                	// 'user' is always the "app name" of related collections
	                    [`user/${collectionName}`]: {
	                        "q/select": [
	                            `${collectionAppName}/name`,
	                            {"workflow/state": ["enum/name"]}
	                        ],
	                        "q/limit": "q/no-limit"
	                    }
	                }
	            ],
				"q/where": ["=", "fibery/id", "$id"],
				"q/limit": "q/no-limit"
			},
			"params": {
				"$id": entityId
			}
		}
	}]
});