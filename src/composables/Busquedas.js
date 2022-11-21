const APIKEY = import.meta.env.VITE_APIKEY;
const Busquedas = () => {
    const githubGraphiQL = async (txt) => {
        console.log('githubGraphiQL',txt);

        const consultaGraphiQL = `{
            search(
              type: REPOSITORY
              query: """
              topic:${txt}
              stars:>10
              forks:>3
              size:>2000
              pushed:>=2020-01-01
                  sort:stars-desc
              """
              last: 50
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


        const options = {
            method: 'POST',
            headers: {
              Authorization: 'bearer '+APIKEY,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({"query":consultaGraphiQL})
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