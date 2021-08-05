async function fetchReward(url) {
    const [ , , , owner, name] = url.split('/');
    return await fetch("https://mnk2smepzzdp5djxpbthzr6odq.appsync-api.eu-west-1.amazonaws.com/graphql", {
        method: "POST",
        headers: {
            "x-api-key": "da2-fql7xoajcng6pilmew4lfbi6ga"
        },
        body: JSON.stringify({
            query: /* GraphQL */ `
            query GetBountyMetrics($owner: String!, $name: String!) {
                getBountyMetrics(owner: $owner, name: $name) {
                bounty_reward
                popularity_score
                merge_chance
                }
            }`,
            variables: {
                owner,
                name
            }
        }),
    })
    .then(response => response.json())
    .then(({ data }) => data.getBountyMetrics?.bounty_reward);
};

fetch(chrome.runtime.getURL("/html/bounty_tab.html")).then(r => r.text()).then(async (html) => {
    const url = window.location.toString();
    const reward_amount = await fetchReward(url);
    if (reward_amount) {
        const list = document.querySelector("ul.UnderlineNav-body");
        const bountyTab = document.createElement('li');
        bountyTab.innerHTML = html;
        list.appendChild(bountyTab);

        const bounty_reward = document.getElementById('bounty-reward')
        bounty_reward.innerText = reward_amount;

        const bounty_url = document.getElementById('bounty-url')
        bounty_url.setAttribute("href", "https://www.huntr.dev/bounties/disclose/?target=" + url);
    };
});