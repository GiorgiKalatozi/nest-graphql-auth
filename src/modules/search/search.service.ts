import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly configService: ConfigService,
  ) {}

  public async createIndex(): Promise<void> {
    const index = this.configService.get<string>('ELASTICSEARCH_INDEX');
    const indexExists = await this.elasticsearchService.indices.exists({
      index,
    });

    if (!indexExists) {
      try {
        await this.elasticsearchService.indices.create({
          index,
          body: {
            mappings: {
              properties: {
                name: {
                  type: 'text',
                  fields: {
                    keyword: {
                      type: 'keyword',
                      ignore_above: 256,
                    },
                  },
                },
              },
            },
          },
        });
        console.log(`Index '${index}' created successfully.`);
      } catch (error) {
        console.error(`Failed to create index '${index}': ${error.message}`);
      }
    } else {
      console.log(`Index '${index}' already exists.`);
    }
  }

  async indexDocument(index: string, id: string, body: any): Promise<any> {
    return await this.elasticsearchService.index({
      index,
      id,
      body,
    });
  }

  public async search(index: string, queryText: string): Promise<any> {
    return this.elasticsearchService.search({
      index,
      body: {
        query: {
          wildcard: {
            'name.keyword': `*${queryText}*`,
          },
        },
      },
    });
  }
  public async searchByWord(index: string, queryText: string): Promise<any> {
    return this.elasticsearchService.search({
      index,
      body: {
        query: {
          multi_match: {
            query: queryText,
            fields: ['name', 'content', 'username', 'email'],
          },
        },
      },
    });
  }

  public async remove(id: number, index: string) {
    this.elasticsearchService.deleteByQuery({
      index,
      // index: this.configService.get('ELASTICSEARCH_INDEX')!,
      body: {
        query: {
          match: {
            id: id,
          },
        },
      },
    });
  }
}
