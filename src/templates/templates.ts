export const CAMAPAIGN_TYPE = [
  {
    id: "comment-reply",
    title: "Reply to Comment",
    description: "Automatically reply to comments that match keywords",
    type: "comment-reply",
    variables: {
      mediaId: { type: "string", required: true },
      includeKeywords: ["Link", "Price","Shop"],
      regex: { type: "string", required: false },
      replyText: { type: "string", required: false },
      defaultReplyText: ["Thanks", "Appreciate it", "Gratefull!"],
    },
  },

  {
    id: "comment-reply-dm",
    title: "Reply to Comment + Send DM",
    description: "Reply to comments and send follow-up DM",
    type: "comment-reply-dm",
    variables: {
      mediaId: { type: "string", required: true },
      includeKeywords: { type: "string[]", required: false },
      regex: { type: "string", required: false },
      replyText: { type: "string", required: false },
      dmText: { type: "string", required: false },
      buttons: { type: "Button[]", required: false, max: 3 },
      defaultReplyText: [
        "Please Check out you Dms",
        "Thanks! Please see your Dms",
        "Gratefull! Check your Dms",
        "Nice! Check your Dms",
      ],
      defaultDmText: ["Hey there! I’m so happy you’re here, thanks so much for your interest 😊 Click below and to see our products ✨"],
    },
  },
];
