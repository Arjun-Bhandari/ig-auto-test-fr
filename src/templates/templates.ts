
export const CAMAPAIGN_TYPE = [


{
    "id": "comment-reply",
    "title": "Reply to Comment",
    "description": "Automatically reply to comments that match keywords",
    "type": "comment-reply",
    "variables": {
      "mediaId": { "type": "string", "required": true },
      "includeKeywords": { "type": "string[]", "required": false },
      "regex": { "type": "string", "required": false },
      "replyText": { "type": "string", "required": false },
      "responses": { "type": "string[]", "required": false },
      "randomize": { "type": "boolean", "required": false, "default": false }
    },
    "nodes": [
      {
        "id": "trigger",
        "type": "trigger",
        "position": { "x": 120, "y": 100 },
        "data": { "label": "User comments", "ui": { "color": "#2563eb", "badge": "Trigger" } }
      },
      {
        "id": "reply",
        "type": "comment_reply",
        "position": { "x": 420, "y": 100 },
        "data": { "label": "Reply", "ui": { "color": "#16a34a", "badge": "Comment" } }
      }
    ],
    "edges": [
      {
        "id": "e-trigger-reply",
        "source": "trigger",
        "target": "reply",
        "type": "default",
        "style": { "stroke": "#94a3b8" }
      }
    ]
  },


  {
    "id": "comment-reply-dm",
    "title": "Reply to Comment + Send DM",
    "description": "Reply to comments and send follow-up DM",
    "type": "comment-reply-dm",
    "variables": {
      "mediaId": { "type": "string", "required": true },
      "includeKeywords": { "type": "string[]", "required": false },
      "regex": { "type": "string", "required": false },
      "replyText": { "type": "string", "required": false },
      "responses": { "type": "string[]", "required": false },
      "randomize": { "type": "boolean", "required": false, "default": false },
      "dmText": { "type": "string", "required": false },
      "buttons": { "type": "Button[]", "required": false, "max": 3 }
    },
    "nodes": [
      {
        "id": "trigger",
        "type": "trigger",
        "position": { "x": 120, "y": 100 },
        "data": { "label": "User comments", "ui": { "color": "#2563eb", "badge": "Trigger" } }
      },
      {
        "id": "reply",
        "type": "comment_reply",
        "position": { "x": 420, "y": 100 },
        "data": { "label": "Reply", "ui": { "color": "#16a34a", "badge": "Comment" } }
      },
      {
        "id": "dm",
        "type": "dm_message",
        "position": { "x": 720, "y": 100 },
        "data": { "label": "Send DM", "ui": { "color": "#7c3aed", "badge": "DM" } }
      }
    ],
    "edges": [
      {
        "id": "e-trigger-reply",
        "source": "trigger",
        "target": "reply",
        "type": "default",
        "style": { "stroke": "#94a3b8" }
      },
      {
        "id": "e-reply-dm",
        "source": "reply",
        "target": "dm",
        "type": "default",
        "style": { "stroke": "#94a3b8" }
      }
    ]
  }

]