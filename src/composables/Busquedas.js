const APIKEY = import.meta.env.VITE_APIKEY;
const Busquedas = () => {
    const githubGraphiQL = async (data) => {
        console.log('githubGraphiQL',data);

        const consultaGraphiQL = `{
            search(
              type: REPOSITORY
              query: """
              topic:${data.txt}
              stars:>${data.stars}
              forks:>3
              size:>2000
              pushed:>=2020-01-01
                  sort:stars-desc
              """
              last: ${data.top}
            ) {
              repos: edges {
                repo: node {
                  ... on Repository {
                    url
                    name
                    forkCount
                    stargazerCount
                              allIssues: issues {
                      totalCount
                    }
                    openIssues: issues(states: OPEN) {
                      totalCount
                    }
                    repositoryTopics(first: 5) {
                      nodes {
                        topic {
                          name
                        }
                      }
                    }
                  }
                }
              }
            }
          }`;

        const withoutLineBreaks = consultaGraphiQL.replace(/[\r\n]/gm, '');
        const options = {
            method: 'POST',
            headers: {
              Authorization: 'bearer '+APIKEY,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: withoutLineBreaks })
          };
          
          const response = await fetch('https://api.github.com/graphql', options)
            .then(response => response.json())
            .catch(err => console.error(err));
        
        
        // Operador Ternario que en 1 sola linea verifica que existan las 3 posiciones
        return (response?.data?.search?.repos ? response?.data?.search?.repos:[]);

    };

    return { githubGraphiQL }
}

export default Busquedas;