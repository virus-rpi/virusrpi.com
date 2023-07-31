import React, {useEffect, useState} from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface GithubRepositoryProps {
    name: string;
    url: string;
    md_url: string;
}

function convertImgToMarkdown(htmlString: string) {
  const regex = /<img\s+src="(.*?)"\s*\/?>/g;
  return htmlString.replace(regex, '![$1]($1)');
}

function GithubRepository( {name, url, md_url}: GithubRepositoryProps ) {
    const [markdown, setMarkdown] = useState('');

    useEffect(() => {
      const fetchMarkdown = async () => {
        try {
          const response = await fetch(md_url);
          const data = await response.text();
          setMarkdown(convertImgToMarkdown(data));
        } catch (error) {
          console.error('Error fetching Markdown:', error);
        }
      };

      fetchMarkdown().catch(console.error);
    }, [md_url]);

  return (
    <div>
        <h3><a href={url}>{name}</a></h3>
        <ReactMarkdown children={markdown} remarkPlugins={[remarkGfm]} />
    </div>
  )
}

export default GithubRepository