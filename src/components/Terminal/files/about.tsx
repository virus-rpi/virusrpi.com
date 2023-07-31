import React, {useEffect, useState} from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function convertImgToMarkdown(htmlString: string) {
  // Use regular expression to find and replace the img tags with markdown syntax
  const regex = /<img\s+src="(.*?)"\s*\/?>/g;
  return htmlString.replace(regex, '![$1]($1)');
}

function About() {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/virus-rpi/virus-rpi/main/README.md');
        const data = await response.text();
        setMarkdown(convertImgToMarkdown(data));
      } catch (error) {
        console.error('Error fetching Markdown:', error);
      }
    };

    fetchMarkdown().catch(console.error);
  }, []);

  return (
    <div>
      <ReactMarkdown children={markdown} remarkPlugins={[remarkGfm]} />
    </div>
  );
}

export default About;
